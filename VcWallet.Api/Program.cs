using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using VcWallet.Api.Configuration;
using VcWallet.Api.Middleware;
using VcWallet.Api.Services;
using VcWallet.Business.Contracts;
using VcWallet.Domain.Contexts;
using VcWallet.Eth.Contracts.Interfaces;
using VcWallet.Eth.Contracts.Services;

var builder = WebApplication.CreateBuilder(args);

var walletDbConnectionString = builder.Configuration.GetConnectionString("WalletDb")
    ?? throw new InvalidOperationException("Connection string 'WalletDb' not found.");

builder.Services.Configure<GovernanceOptions>(builder.Configuration.GetSection("Governance"));
builder.Services.Configure<OffchainSignatureHubOptions>(builder.Configuration.GetSection("OffchainSignatureHub"));

// Add services to the container.
builder.Services.AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<VcWalletDbContext>()
    .AddDefaultTokenProviders();
builder.Services.AddDbContext<VcWalletDbContext>(options =>
    options.UseSqlServer(walletDbConnectionString));
builder.Services.AddScoped<VcWallet.DataAccess.Repositories.OffChainProposalSignatureRepository>();
builder.Services.AddScoped<VcWallet.Business.Commands.SignOffChainProposalCommandHandler>();
builder.Services.AddScoped<VcWallet.Business.Queries.GetOffChainProposalSignaturesQueryHandler>();
builder.Services.AddSingleton<IOffchainSignatureHubService>(sp =>
{
    var opts = sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<OffchainSignatureHubOptions>>().Value;
    return new OffchainSignatureHubService(opts);
});
builder.Services.AddSingleton<IOffChainGovernanceReader>(sp =>
    new OffchainGovernanceReaderAdapter(sp.GetRequiredService<IOffchainSignatureHubService>()));

builder.Services.AddScoped<AuthMiddleware>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    services.GetRequiredService<VcWalletDbContext>().Database.EnsureCreated();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

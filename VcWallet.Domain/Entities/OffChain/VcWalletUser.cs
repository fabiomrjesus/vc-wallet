using System.ComponentModel.DataAnnotations;

namespace VcWallet.Domain.Entities.OffChain;

public class VcWalletUser
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    [MaxLength(150)]
    public required string UserName { get; set; }

    [MaxLength(320)]
    public string? Email { get; set; }

    public Guid? RoleId { get; set; }
    public VcWalletRole? Role { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

using System.ComponentModel.DataAnnotations;

namespace VcWallet.Domain.Entities.OffChain;

public class VcWalletRole
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public required string Name { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }
}

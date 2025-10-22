using Microsoft.Extensions.Options;
using Moongy.Labs.VcWallet.EvmHandler.Models;

namespace Moongy.Labs.VcWallet.EvmHandler;
public class EvmClient(IOptions<EvmClientOptions> options) : IEvmClient
{
}

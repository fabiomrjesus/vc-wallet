namespace Moongy.Labs.VcWallet.Bitcoin.Models;
public record BtcUtxo(string TxId, uint Vout, long Satoshi, string ScriptPubKey, int Confirmations);


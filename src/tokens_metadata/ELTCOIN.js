const Web3 = require("web3");

class TokenERC20 {

    constructor(symbol, decimals, contractAddress, name, ABI) {
        this.symbol = symbol
        this.contractAddress = contractAddress
        this.methods = contractAddress
        this.name = name
        this.decimals = decimals
        this.ABI = ABI

        this._instance = new web3.eth.Contract(
            ABI,
            contractAddress
        );

        this.methods = this._instance.methods
    }

    getInstance(){
        return this._instance
    }

    intTodecimal(amout){
        return (amout * 10 ** this.decimals)
    }

    decimalsToInt(amout){
        return (amout / 10 ** this.decimals)
    }

    prettyDecimal(amount) {
        const x = this.intTodecimal(amount).toString().split('.')
        return parseFloat(x[0] +'.'+ x[1].substr(0,2))
    }

}

class Account  {}
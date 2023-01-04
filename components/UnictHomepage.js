import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

export default function UnictHomepage() {
    const { Moralis, isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    //console.log(`ChainId is ${chainId}`)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null
    const wallet = account

    const [isAdmin, checkTheAdmin] = useState("0")
    const [isStudent, checkStudent] = useState("0")
    const [isProfessor, checkProf] = useState("0")
    const [isSecretary, checkSecretary] = useState("0")

    async function retrieveAddress() {
        Moralis.User.currentAsync().then(function (user) {
            var wallet1 = user.get("ethAddress")
        })
        // return wallet
    }

    /*
    console.log(isInitialized)
    if (isInitialized) {
        wallet = Moralis.User.current().get("ethAddress")
    } */

    /* View Functions */
    const { runContractFunction: checkAdmin } = useWeb3Contract({
        abi: abi,
        contractAddress: DAOUnict_address, // specify the networkId
        functionName: "checkAdmin",
        params: { addr: wallet },
    })

    const { runContractFunction: checkExistingProfessor } = useWeb3Contract({
        abi: abi,
        contractAddress: DAOUnict_address,
        functionName: "checkExistingProfessor",
        params: { PubKeyProf: wallet },
    })

    async function checkUser() {
        const checkAdminResult = await checkAdmin({
            onSuccess: (data) => console.log(data),
            onError: (error) => console.log(error),
        })
        checkTheAdmin(checkAdminResult)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            checkUser()
            console.log(checkExistingProfessor())
        }
    }, [isWeb3Enabled])

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Unict</h1>
            {DAOUnict_address ? (
                <>{isAdmin ? <h1>Welcome admin!</h1> : <h1>Sorry not admin</h1>}</>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}

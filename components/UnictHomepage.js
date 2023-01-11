import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import AdminHomepage from "./AdminHomepage"
import SecretaryHomepage from "./SecretaryHomepage"
import ProfessorHomepage from "./ProfessorHomepage"
import StudentHomepage from "./StudentHomepage"
import GuestHomepage from "./GuestHomepage"

export default function UnictHomepage() {
    const { Moralis, isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(chainIdHex)
    //console.log(`ChainId is ${chainId}`)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null
    const wallet = account

    const [isAdmin, checkTheAdmin] = useState(false)
    const [isStudent, checkStudent] = useState(false)
    const [isProfessor, checkProf] = useState(false)
    const [isSecretary, checkSecretary] = useState(false)

    // View Functions
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

    const { runContractFunction: checkExistingSecretariat } = useWeb3Contract({
        abi: abi,
        contractAddress: DAOUnict_address,
        functionName: "checkExistingSecretariat",
        params: { PubKeySecretary: wallet },
    })

    const { runContractFunction: checkExistingStudent } = useWeb3Contract({
        abi: abi,
        contractAddress: DAOUnict_address,
        functionName: "checkExistingStudent",
        params: { PubKeyStudent: wallet },
    })

    async function checkUser() {
        const checkAdminResult = await checkAdmin({
            onSuccess: (data) => console.log(data),
            onError: (error) => console.log(error),
        })
        checkTheAdmin(checkAdminResult)
        const checkSecretaryResult = await checkExistingSecretariat({
            onSuccess: (data) => console.log(data),
            onError: (error) => console.log(error),
        })
        checkSecretary(checkSecretaryResult)
        const checkProfessorResult = await checkExistingProfessor({
            onSuccess: (data) => console.log(data),
            onError: (error) => console.log(error),
        })
        checkProf(checkProfessorResult)
        const checkStudentResult = await checkExistingStudent({
            onSuccess: (data) => console.log(data),
            onError: (error) => console.log(error),
        })
        checkStudent(checkStudentResult)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            checkUser()
        }
    }, [account])

    function renderHomepage() {
        if (isAdmin) {
            console.log("render admin")
            return <AdminHomepage />
        } else if (isSecretary) {
            console.log("render secretary")
            return <SecretaryHomepage />
        } else if (isProfessor) {
            console.log("render prof")
            return <ProfessorHomepage />
        } else if (isStudent) {
        } else {
            // <GuestHomepage />
        }
        // document.getElementById("loginBtn").delete()
    }
    // isAdmin ? <AdminHomepage /> : null
    // {isSecretary ? <SecretaryHomepage /> : null}

    // <button id="loginBtn" onClick={renderHomepage}> Enter </button>

    // <>{renderHomepage()}</>

    return (
        <div className="p-5">
            {DAOUnict_address ? (
                <>
                    {isAdmin ? <AdminHomepage /> : null}
                    {isSecretary ? <SecretaryHomepage /> : null}
                    {isProfessor ? <ProfessorHomepage /> : null}
                    {isStudent ? <StudentHomepage /> : null}
                    {!isStudent && !isAdmin && !isProfessor && !isSecretary ? (
                        <GuestHomepage />
                    ) : null}
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}

import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Form, useNotification, Avatar } from "web3uikit"
import { useEffect, useState } from "react"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default function StudentHomepage() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

    const [studentName, setStudentName] = useState("")

    async function infoStudentExecution() {
        const studentAddress = account

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingStudent",
            params: {
                PubKeyStudent: studentAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                setStudentName(data[0])
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            infoStudentExecution()
        }
    }, [account])

    async function checkDegreeCourseExecution(data) {
        const degreeCourseID = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkDegreeCourse",
            params: {
                courseId: degreeCourseID,
            },
        }

        const notificationCheck = (data) => {
            if (data == true) {
                dispatch({
                    type: "success",
                    message: "This identifier belongs to a Unict degree course",
                    title: "Check course degree",
                    position: "topL",
                })
            } else {
                dispatch({
                    type: "error",
                    message: "This course degree identifier doesn't exist",
                    title: "Check course degree",
                    position: "topL",
                })
            }
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationCheck(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Generic error")
            },
        })
    }

    async function checkSubjectIntoCourseExecution(data) {
        const degreeCourseID = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkSubjectIntoCourse",
            params: {
                courseId: degreeCourseID,
                code: codeSubject,
            },
        }

        const notificationCheck = (data) => {
            if (data == true) {
                dispatch({
                    type: "success",
                    message:
                        "This code belongs to a subject in the study plan of the selected degree course",
                    title: "Check course degree",
                    position: "topL",
                })
            } else {
                dispatch({
                    type: "error",
                    message: "No subject found with this code in the selected degree course",
                    title: "Check course degree",
                    position: "topL",
                })
            }
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationCheck(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error! Maybe the course degree identifier inserted is not correct or it doesn't exist"
                )
            },
        })
    }

    async function infoSubjectExecution(data) {
        const degreeCourseID = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoSubject",
            params: {
                courseId: degreeCourseID,
                code: codeSubject,
            },
        }

        const notificationInfoSubject = (data) => {
            dispatch({
                type: "success",
                message: data.join("\r\n"),
                title: "Subject details",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationInfoSubject(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error: please check the degree course identifier or the subject's code inserted and retry"
                )
            },
        })
    }

    async function registerToExamExecution(data) {
        const date = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "registerToExam",
            params: {
                date: date,
                codeSubject: codeSubject,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleRegisterToExamSuccess,
            onError: (error) => {
                console.log(error)
                window.alert("Error! Please check the inserted subject's code for your booking")
            },
        })
    }
    async function handleRegisterToExamSuccess(tx) {
        getCodeBookingExam
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Dear student, your booking was registered succesfully!",
            title: "Booking to exam",
            position: "topL",
        })
    }

    async function getCodeBookingExam() {
        const options = {
            abi: abi,
            contractAddresses: DAOUnict_address,
            functionName: "getCodeBookingForExam",
            params: {},
        }

        const notificationGetCodeBooking = (data) => {
            dispatch({
                type: "success",
                message: "Your code booking for the exam is: " + data,
                title: "Keep this code to show it to the prof",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationGetCodeBooking(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Generic error")
            },
        })
    }

    async function checkCfuAcquired() {
        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkCfuAcquired",
            params: {},
        }

        const notificationCheckingCfu = (data) => {
            dispatch({
                type: "success",
                message: "Dear student, you've " + data + " CFU acquired right now ",
                title: "Checking cfu acquired",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationCheckingCfu(data)
                //console.log(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Generic error")
            },
        })
    }

    async function checkSubjectDone() {
        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkSubjectsDone",
            params: {},
        }

        const notificationCheckSubjects = (data) => {
            dispatch({
                type: "success",
                message:
                    "Dear student, these are the codes of your subjects already completed and acquired: " +
                    data.join("\r\n"),
                title: "Checking student's career",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationCheckSubjects(data)
                //console.log(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Generic error")
            },
        })
    }

    async function infoProfExecution(data) {
        const profAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingProfessor",
            params: {
                PubKeyProf: profAddress,
            },
        }

        const notificationInfoProf = (data) => {
            dispatch({
                type: "success",
                message: data.join("\r\n"),
                title: "Professor details",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationInfoProf(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "The inserted address is not valid: please check if it belongs to a Unict's teacher"
                )
            },
        })
    }

    async function infoSecretaryExecution(data) {
        const secretaryAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingSecretariat",
            params: {
                PubKeySecretary: secretaryAddress,
            },
        }

        const notificationInfoSecretariat = (data) => {
            dispatch({
                type: "success",
                message: data.join("\r\n"),
                title: "Secretariat details",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationInfoSecretariat(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "The inserted address is not valid: please check if it belongs to a Unict's secretariat"
                )
            },
        })
    }

    async function viewNftExecution() {
        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "getDegreeCertificateNft",
            params: {
                studAddr: account,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                handleViewNftSuccess(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Error: you need to graduate for view your NFT degree certificate!")
            },
        })
    }
    async function handleViewNftSuccess(data) {
        const nftUri = data.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
        const nftURIResponse = await (await fetch(nftUri)).json()
        const imageURI = nftURIResponse.image
        const imageURIURL = imageURI.replace("ipfs://", "https://cloudflare-ipfs.com/ipfs/")
        dispatch({
            type: "success",
            message: "Follow this link to see the NFT certificate: " + imageURIURL,
            title: "View your NFT degree certificate",
            position: "topL",
        })
    }

    function popUpCheckSubjectIntoCourse() {
        return (
            <Form
                buttonConfig={{
                    text: "Check subject",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "DegreeCourseID",
                        name: "Degree course identifier",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SubjectCode",
                        name: "Subject's code identifier",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={checkSubjectIntoCourseExecution}
                title="CheckSubject"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpCheckDegreeCourse() {
        return (
            <Form
                buttonConfig={{
                    text: "Check degree course",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "DegreeCourseID",
                        name: "Degree course identifier",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={checkDegreeCourseExecution}
                title="Check degree course"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpInfoSubject() {
        return (
            <Form
                buttonConfig={{
                    text: "Show subject's info",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "DegreeCourseID",
                        name: "Degree course identifier",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SubjectCode",
                        name: "Subject's code identifier",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={infoSubjectExecution}
                title="Info subject"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpRegisterToExam() {
        return (
            <Form
                buttonConfig={{
                    text: "Booking",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "BookingDate",
                        name: "Date of the booking",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SubjectCode",
                        name: "Subject's code identifier",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={registerToExamExecution}
                title="Booking to exam"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpInfoProfessor() {
        return (
            <Form
                buttonConfig={{
                    text: "Show teacher's info",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "ProfAddress",
                        name: "Address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={infoProfExecution}
                title="Info professor"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpInfoSecretary() {
        return (
            <Form
                buttonConfig={{
                    text: "Show secretariat's info",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "SecretaryAddress",
                        name: "Address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={infoSecretaryExecution}
                title="Info secretariat"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-3xl mb-5 hover:animate-pulse">
                Welcome, {studentName}!
            </h1>
            <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                Subjects & degree courses info
                <Avatar theme="image" image="https://img.icons8.com/color/512/info-squared.png" />
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                            Check a degree course
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpCheckDegreeCourse()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 ">
                            Check a subject into a degree course
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpCheckSubjectIntoCourse()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 ">
                            Info about a subject
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpInfoSubject()}
                </Popup>
            </span>
            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Exams & carrier management
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/ultraviolet/512/test-partial-passed.png"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-12">
                                Booking to an exam
                            </button>
                        }
                        position="right center"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpRegisterToExam}
                    </Popup>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
                        onClick={checkCfuAcquired}
                    >
                        Check your CFU
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
                        onClick={checkSubjectDone}
                    >
                        Check your career
                    </button>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
                        onClick={viewNftExecution}
                    >
                        View your NFT degree certificate
                    </button>
                </span>
            </div>
            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Profs & secretariats info
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/plasticine/512/teacher.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-24">
                                Info about a professor
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpInfoProfessor()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Info about a secretariat
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpInfoSecretary()}
                    </Popup>
                </span>
            </div>
        </div>
    )
}

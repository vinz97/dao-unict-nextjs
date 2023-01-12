import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { Form, useNotification, Avatar } from "web3uikit"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default function ProfessorHomepage() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

    const [profSurname, setProfSurname] = useState("")

    async function infoProfExecution() {
        const profAddress = account

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingProfessor",
            params: {
                PubKeyProf: profAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                setProfSurname(data[1])
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            infoProfExecution()
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

    async function registerExamExecution(data) {
        const studentAddr = data.data[0].inputResult
        const degreeCourseID = data.data[1].inputResult
        const codeSubject = data.data[2].inputResult
        const date = data.data[3].inputResult
        const grade = data.data[4].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "registerExam",
            params: {
                studAddr: studentAddr,
                courseId: degreeCourseID,
                codeSubject: codeSubject,
                date: date,
                grade: grade,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                console.log(data)
                handleRegisterExamSuccess
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error! Please check: if the address belongs to a student, if the student" +
                        " is subscribed to the degree course submitted and if the student already registered this subject"
                )
            },
        })
    }
    async function handleRegisterExamSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The exam was registered succesfully!",
            title: "Exam registration",
            position: "topL",
        })
    }

    async function checkExamBookingExecution(data) {
        const codeBook = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addStudent",
            params: {
                bookingCode: codeBook,
            },
        }

        const notificationInfoSubject = () => {
            dispatch({
                type: "success",
                message: "The exam booking's code is valid",
                title: "Checking exam booking",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationInfoSubject()
                console.log(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("The code inserted doesn't belong to any exam booking")
            },
        })
    }

    async function checkAvailableTokens() {
        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkAvailableTokenPerProfessor",
            params: {
                pubKeyProf: account,
            },
        }

        const notificationAvailableToken = (data) => {
            dispatch({
                type: "success",
                message: "You've " + data + " token left",
                title: "assignable tokens availability",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationAvailableToken(data)
                //console.log(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Generic error")
            },
        })
    }

    async function checkStudentExecution(data) {
        const studentAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkExistingStudent",
            params: {
                PubKeyStudent: studentAddress,
            },
        }

        const notificationCheck = (data) => {
            if (data == true) {
                dispatch({
                    type: "success",
                    message: "This address belongs to a Unict student!",
                    title: "Check student",
                    position: "topL",
                })
            } else {
                dispatch({
                    type: "error",
                    message: "This address doesn't belong to a Unict student!",
                    title: "Check student",
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
                    "The inserted address is not valid: please check and retry with a correct value"
                )
            },
        })
    }

    async function infoStudentExecution(data) {
        const studentAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingStudent",
            params: {
                PubKeySecretary: studentAddress,
            },
        }

        const notificationInfoStudent = (data) => {
            dispatch({
                type: "success",
                message: data.join("\r\n"),
                title: "Student details",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationInfoStudent(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert(
                    "The inserted address is not valid: please check if it belongs to a Unict's student"
                )
            },
        })
    }

    async function checkTokenBalanceExecution(data) {
        const address = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkTokenBalance",
            params: {
                addr: address,
            },
        }

        const notificationCheckTokenBalance = (data) => {
            dispatch({
                type: "success",
                message: "This address has " + data + " CFU(tokens)",
                title: "CFU/Token balance",
                position: "topL",
            })
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                notificationCheckTokenBalance(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Error! Maybe the inserted address is not valid")
            },
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

    function popUpRegisterExam() {
        return (
            <Form
                buttonConfig={{
                    text: "Register",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "StudentAddress",
                        name: "Student address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "DegreeCourseID",
                        name: "Degree course id",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "CodeSubject",
                        name: "Subject's code",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ExamDate",
                        name: "Date",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ExamGrade",
                        name: "Grade",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={registerExamExecution}
                title="Register an exam"
                className="overflow-y-scroll h-full w-full"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpCheckExamBooking() {
        return (
            <Form
                buttonConfig={{
                    text: "Check exam booking",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "BookingCode",
                        name: "Booking code",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={checkExamBookingExecution}
                title="Check student's exam booking"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpCheckStudent() {
        return (
            <Form
                buttonConfig={{
                    text: "Check student",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "StudentAddress",
                        name: "Address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={checkStudentExecution}
                title="Check student"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpInfoStudent() {
        return (
            <Form
                buttonConfig={{
                    text: "Show student's info",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "StudentAddress",
                        name: "Address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={infoStudentExecution}
                title="Info student"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpCheckTokenBalance() {
        return (
            <Form
                buttonConfig={{
                    text: "Show balance",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "TokenAddress",
                        name: "Address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={checkTokenBalanceExecution}
                title="Token / CFU Balance"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-3xl mb-5 hover:animate-pulse">
                Welcome, Prof. {profSurname}!
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
                    Exams management
                    <Avatar theme="image" image="https://img.icons8.com/color/512/exam.png" />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-28">
                                Register an exam
                            </button>
                        }
                        position="right center"
                        contentStyle={{ width: "25%", height: "70%" }}
                    >
                        {popUpRegisterExam()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Check a student's exam booking
                            </button>
                        }
                        position="right center"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckExamBooking()}
                    </Popup>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10"
                        onClick={checkAvailableTokens}
                    >
                        Check assignable tokens availability
                    </button>
                </span>
            </div>

            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Students info
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/office/512/student-male.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-40">
                                Check student
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckStudent()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Info about a student
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpInfoStudent()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Check token/CFU balance
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckTokenBalance()}
                    </Popup>
                </span>
            </div>
        </div>
    )
}

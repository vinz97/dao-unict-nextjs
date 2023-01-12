import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Form, useNotification, Avatar } from "web3uikit"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default function GuestHomepage() {
    const { chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

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

    async function checkProfExecution(data) {
        const profAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkExistingProfessor",
            params: {
                PubKeyProf: profAddress,
            },
        }

        const notificationCheck = (data) => {
            if (data == true) {
                dispatch({
                    type: "success",
                    message: "This address belongs to a Unict professor!",
                    title: "Check professor",
                    position: "topL",
                })
            } else {
                dispatch({
                    type: "error",
                    message: "This address doesn't belong to a Unict professor!",
                    title: "Check professor",
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

    async function checkSecretaryExecution(data) {
        const secretaryAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "checkExistingSecretariat",
            params: {
                PubKeySecretary: secretaryAddress,
            },
        }

        const notificationCheck = (data) => {
            if (data == true) {
                dispatch({
                    type: "success",
                    message: "This address belongs to a Unict secretariat!",
                    title: "Check secretary",
                    position: "topL",
                })
            } else {
                dispatch({
                    type: "error",
                    message: "This address doesn't belong to a Unict secretariat!",
                    title: "Check secretary",
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

    function popUpCheckProf() {
        return (
            <Form
                buttonConfig={{
                    text: "Check professor",
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
                onSubmit={checkProfExecution}
                title="Check professor"
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

    function popUpCheckSecretariat() {
        return (
            <Form
                buttonConfig={{
                    text: "Check secretary",
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
                onSubmit={checkSecretaryExecution}
                title="Check secretariat"
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
                Welcome, guest!
            </h1>
            <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                Subjects & degree courses info
                <Avatar
                    theme="image"
                    image="https://img.icons8.com/color/512/info-squared.png"
                    isRounded="true"
                />
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
                    Profs & secretariats info
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/plasticine/512/teacher.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-24">
                                Check professor
                            </button>
                        }
                        position="right center"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckProf()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 ">
                                Info about a professor
                            </button>
                        }
                        position="right center"
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
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Check secretariat
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckSecretariat()}
                    </Popup>
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
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-44">
                                Check student
                            </button>
                        }
                        position="right top"
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

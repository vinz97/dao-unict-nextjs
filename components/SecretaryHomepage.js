import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { Form, useNotification } from "web3uikit"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default function SecretaryHomepage() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

    const [areaSecretariat, setAreaSecretariat] = useState("")

    async function infoSecretaryExecution() {
        const secretaryAddress = account

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "infoExistingSecretariat",
            params: {
                PubKeySecretary: secretaryAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                setAreaSecretariat(data[1])
            },
            onError: (error) => {
                console.log(error)
            },
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            infoSecretaryExecution()
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

    async function modifyCfuExecution() {
        const degreeCourseID = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult
        const newCfu = data.data[2].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "modifyCfu",
            params: {
                courseId: degreeCourseID,
                code: codeSubject,
                newCFU: newCfu,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleEditCfuSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error: please check the degree course identifier or the subject's code inserted and retry"
                )
            },
        })
    }
    async function handleEditCfuSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The cfu of the subject were edited successfully!",
            title: "Modify subject's CFU",
            position: "topL",
        })
    }

    async function modifyTeacherExecution(data) {
        const degreeCourseID = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult
        const newProf = data.data[2].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "modifyTeacher",
            params: {
                courseId: degreeCourseID,
                code: codeSubject,
                newProfessorAddr: newProf,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleEditTeacherSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error: please check the degree course identifier or the subject's code inserted and retry"
                )
            },
        })
    }
    async function handleEditTeacherSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The new professor for the subject was edited successfully!",
            title: "Modify subject's teacher",
            position: "topL",
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

    async function addStudentExecution(data) {
        const name = data.data[0].inputResult
        const surname = data.data[1].inputResult
        const degreeCourse = data.data[2].inputResult
        const email = data.data[3].inputResult
        const telephone = data.data[4].inputResult
        const address = data.data[5].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addStudent",
            params: {
                _name: name,
                _surname: surname,
                _courseSubscribed: degreeCourse,
                _email: email,
                telephone: telephone,
                pubKey: address,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleAddStudentSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Something went wrong: please check the degree course identifier or the address' validity"
                )
            },
        })
    }
    async function handleAddStudentSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The new student was added succesfully!",
            title: "Adding student",
            position: "topL",
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

    function popUpModifyCfu() {
        return (
            <Form
                buttonConfig={{
                    text: "Edit subject's CFU",
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
                    {
                        key: "SubjectCFU",
                        name: "New CFU",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={modifyCfuExecution}
                title="Modify CFU"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpModifyTeacher() {
        return (
            <Form
                buttonConfig={{
                    text: "Edit subject's prof",
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
                    {
                        key: "SubjectProefssor",
                        name: "New teacher addr",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={modifyTeacherExecution}
                title="Modify teacher"
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

    function popUpAddStudent() {
        return (
            <Form
                buttonConfig={{
                    text: "Add student",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "StudentName",
                        name: "Name",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "StudentSurname",
                        name: "Surname",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "StudentDegreeCourse",
                        name: "Degree course",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "StudentEmail",
                        name: "Email",
                        type: "email",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "StudentTelephone",
                        name: "Telephone",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
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
                onSubmit={addStudentExecution}
                title="Add student"
                className="overflow-y-scroll h-full w-full"
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
            <h1 className="py-4 px-4 font-bold text-3xl mb-5">
                Welcome, {areaSecretariat} secratary!
            </h1>
            <Popup
                trigger={
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
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
            <div>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
                            Edit subject's CFU
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "35%" }}
                >
                    {popUpModifyCfu()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                            Edit subject's prof
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "35%" }}
                >
                    {popUpModifyTeacher()}
                </Popup>
            </div>
            <div>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10 ">
                            Info about a professor
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpInfoProfessor()}
                </Popup>
            </div>
            <div>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                            Add student
                        </button>
                    }
                    position="top"
                    contentStyle={{ width: "25%", height: "70%" }}
                >
                    {popUpAddStudent()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                            Check token/CFU balance
                        </button>
                    }
                    position="top"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpCheckTokenBalance()}
                </Popup>
            </div>
        </div>
    )
}

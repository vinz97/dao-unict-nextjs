import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Form, useNotification } from "web3uikit"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"

export default function AdminHomepage() {
    const { chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

    async function addProfessorExecution(data) {
        const profName = data.data[0].inputResult
        const profSurname = data.data[1].inputResult
        const profRole = data.data[2].inputResult
        const profOffice = data.data[3].inputResult
        const profEmail = data.data[4].inputResult
        const profTelephone = data.data[5].inputResult
        const profWebsite = data.data[6].inputResult
        const profAddress = data.data[7].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addProfessor",
            params: {
                _name: profName,
                _surname: profSurname,
                _role: profRole,
                _office: profOffice,
                _email: profEmail,
                _telephone: profTelephone,
                _website: profWebsite,
                pubKey: profAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleProfAddSuccess,
            //(data) => console.log(data),
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Something went wrong: please check address input or if your wallet is working correctly (remember to have enough ETH for gas)"
                )
            },
        })
    }
    async function handleProfAddSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The new teacher was added succesfully!",
            title: "Adding professor",
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

    async function addDegreeCourseExecution(data) {
        const degreeCourseID = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addDegreeCourse",
            params: {
                courseId: degreeCourseID,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleDegreeCourseAddSuccess,
            onError: (error) => {
                console.log(error)
                window.alert("Generic error! Maybe you don't have enough ETH for the transaction")
            },
        })
    }
    async function handleDegreeCourseAddSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The new degree course was added succesfully!",
            title: "Adding degree course to UNICT",
            position: "topL",
        })
    }

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

    async function deleteDegreeCourseExecution(data) {
        const degreeCourseID = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "deleteDegreeCourse",
            params: {
                courseId: degreeCourseID,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleDeleteDegreeCourseSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error! Maybe the identifier inserted is not correct or it doesn't exist"
                )
            },
        })
    }
    async function handleDeleteDegreeCourseSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The degree course was removed succesfully!",
            title: "Removing a degree course from UNICT",
            position: "topL",
        })
    }

    async function addSubjectToCourseExecution(data) {
        const degreeCourseID = data.data[0].inputResult
        const name = data.data[1].inputResult
        const cfu = data.data[2].inputResult
        const didacticHours = data.data[3].inputResult
        const teacherAddress = data.data[4].inputResult
        const code = data.data[5].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addSubjectToCourse",
            params: {
                courseId: degreeCourseID,
                _name: name,
                _cfu: cfu,
                _didacticHours: didacticHours,
                _teacherAddress: teacherAddress,
                code: code,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleAddSubjectSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error: please check the degree course identifier or the teacher's address and retry "
                )
            },
        })
    }
    async function handleAddSubjectSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message:
                "The subject was added successfully to the study plan of the course degree selected!",
            title: "Adding a subject to a course degree",
            position: "topL",
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

    async function deleteSubjectExecution(data) {
        const degreeCourseID = data.data[0].inputResult
        const codeSubject = data.data[1].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "deleteSubjectFromCourse",
            params: {
                courseId: degreeCourseID,
                code: codeSubject,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleDeleteSubjectSuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Error: please check the degree course identifier or the subject's code inserted and retry"
                )
            },
        })
    }
    async function handleDeleteSubjectSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message:
                "The subject was removed successfully to the study plan of the course degree selected!",
            title: "Removing a subject from a course degree",
            position: "topL",
        })
    }

    async function addSecretaryExecution(data) {
        const personInCharge = data.data[0].inputResult
        const area = data.data[1].inputResult
        const office = data.data[2].inputResult
        const email = data.data[3].inputResult
        const telephone = data.data[4].inputResult
        const address = data.data[5].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "addSecretary",
            params: {
                _personInCharge: personInCharge,
                _area: area,
                _office: office,
                _email: email,
                _telephone: telephone,
                pubKey: address,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleAddSecretarySuccess,
            onError: (error) => {
                console.log(error)
                window.alert(
                    "Something went wrong: please check address input or if your wallet is working correctly (remember to have enough ETH for gas)"
                )
            },
        })
    }
    async function handleAddSecretarySuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The new secretariat was added succesfully!",
            title: "Adding secretariat",
            position: "topL",
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

    function popUpAddProfessor() {
        return (
            <Form
                buttonConfig={{
                    text: "Add professor",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "ProfName",
                        name: "Name",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfSurname",
                        name: "Surname",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfRole",
                        name: "Role",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfOffice",
                        name: "Office",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfEmail",
                        name: "Email",
                        type: "email",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfTelephone",
                        name: "Telephone",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfWebsite",
                        name: "Website",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
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
                onSubmit={addProfessorExecution}
                title="Add professor"
                className="overflow-y-scroll h-full w-full"
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

    function popUpAddDegreeCourse() {
        return (
            <Form
                buttonConfig={{
                    text: "Add degree course",
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
                onSubmit={addDegreeCourseExecution}
                title="Add degree course"
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

    function popUpDeleteDegreeCourse() {
        return (
            <Form
                buttonConfig={{
                    text: "Remove degree course",
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
                onSubmit={deleteDegreeCourseExecution}
                title="Remove degree course"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpAddSubjectToCourse() {
        return (
            <Form
                buttonConfig={{
                    text: "Add subject",
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
                        key: "SubjectName",
                        name: "Name of the subject",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "Cfu",
                        name: "Cfu",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "DidacticHours",
                        name: "Didactic hours needed",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "ProfAddress",
                        name: "Subject's teacher address",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "Code",
                        name: "Subject's code identifier",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={addSubjectToCourseExecution}
                title="Add subject"
                className="overflow-y-scroll h-full w-full"
                isDisabled={isLoading || isFetching}
            />
        )
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
                title="Check subject"
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

    function popUpDeleteSubject() {
        return (
            <Form
                buttonConfig={{
                    text: "Remove this subject",
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
                onSubmit={deleteSubjectExecution}
                title="Remove subject"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpAddSecretary() {
        return (
            <Form
                buttonConfig={{
                    text: "Add secretary",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "PersonInCharge",
                        name: "Person in charge",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SecretaryArea",
                        name: "Area",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SecretaryOffice",
                        name: "Office",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SecretaryEmail",
                        name: "Email",
                        type: "email",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "SecretaryTelephone",
                        name: "Telephone",
                        type: "number",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
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
                onSubmit={addSecretaryExecution}
                title="Add secretariat"
                className="overflow-y-scroll h-full w-full"
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
            <h1 className="py-4 px-4 font-bold text-3xl mb-5">Welcome, admin!</h1>
            <Popup
                trigger={
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">
                        Add professor
                    </button>
                }
                position="right center"
                contentStyle={{ width: "25%", height: "75%" }}
            >
                {popUpAddProfessor()}
            </Popup>
            <Popup
                trigger={
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10 ">
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
            <div>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
                            Add a degree course
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpAddDegreeCourse()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                            Remove a degree course
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpDeleteDegreeCourse()}
                </Popup>
            </div>
            <div>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
                            Add a subject to a degree course
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "70%" }}
                >
                    {popUpAddSubjectToCourse()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10 ">
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
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10 ">
                            Info about a subject
                        </button>
                    }
                    position="right center"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpInfoSubject()}
                </Popup>
                <Popup
                    trigger={
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10 ">
                            Delete a subject from a degree course
                        </button>
                    }
                    position="top"
                    contentStyle={{ width: "25%", height: "30%" }}
                >
                    {popUpDeleteSubject()}
                </Popup>
                <div>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ">
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
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                                Check secretariat
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpCheckSecretariat()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 ml-10">
                                Add secretariat
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "70%" }}
                    >
                        {popUpAddSecretary()}
                    </Popup>
                    <div>
                        <Popup
                            trigger={
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10">
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
            </div>
        </div>
    )
}

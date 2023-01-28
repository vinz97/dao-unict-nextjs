import { contractAddresses, abi } from "../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { Form, useNotification, Avatar, Image } from "web3uikit"
import Popup from "reactjs-popup"
import "reactjs-popup/dist/index.css"
import { ThirdwebStorage } from "@thirdweb-dev/storage"

export default function SecretaryHomepage() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()
    const st = new ThirdwebStorage()

    const dispatch = useNotification()
    const chainId = parseInt(chainIdHex)
    const lastContractAddress = contractAddresses[chainId].length - 1
    const DAOUnict_address =
        chainId in contractAddresses ? contractAddresses[chainId][lastContractAddress] : null

    const [areaSecretariat, setAreaSecretariat] = useState("")
    const [file, setFile] = useState()

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
                PubKeyStudent: studentAddress,
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

    async function uploadDegreeCertificateExecution(data) {
        const studName = data.data[0].inputResult
        const studSurname = data.data[1].inputResult
        const studDegreeCourse = data.data[2].inputResult
        const studGrade = data.data[3].inputResult

        const descr = "This certificate belongs to " + studName + " " + studSurname

        const metadata = {
            name: "NFT Degree Certificate UNICT",
            description: "",
            image: file,
            properties: [
                {
                    degreeCourse: studDegreeCourse,
                    grade: studGrade,
                },
            ],
        }

        metadata.description = descr

        const uploadUrl = await st.upload(metadata)
        dispatch({
            type: "success",
            message:
                "The degree certificate was succesfully uploaded! \n" +
                "IMPORTANT: take note of the IPFS url " +
                "below. You need it for create the nft and associate it for the student! \n" +
                uploadUrl,
            title: "Upload degree certificate to IPFS",
            position: "topL",
        })
        //    alert(
        //        "The degree certificate was succesfully uploaded! \n" +
        //            "IMPORTANT: take note of the IPFS url" +
        //            "below. You need it for create the nft and associate it for the student! \n" +
        //            uploadUrl
        //    )
    }

    async function associateNftExecution(data) {
        const NftUrl = data.data[0].inputResult
        const studAddress = data.data[1].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "associateDegreeNft",
            params: {
                urlNft: NftUrl,
                studentAddr: studAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: handleAssociateNft,
            onError: (error) => {
                console.log(error)
                window.alert("Error: please check if the address belongs to a student")
            },
        })
    }
    async function handleAssociateNft(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "The NFT degree certification was succesfully to the student!",
            title: "Associate NFT degree",
            position: "topL",
        })
    }

    async function viewNftExecution(data) {
        const studAddress = data.data[0].inputResult

        const options = {
            abi: abi,
            contractAddress: DAOUnict_address,
            functionName: "getDegreeCertificateNft",
            params: {
                studAddr: studAddress,
            },
        }

        await runContractFunction({
            params: options,
            onSuccess: (data) => {
                handleViewNftSuccess(data)
            },
            onError: (error) => {
                console.log(error)
                window.alert("Error: this address doesn't belong to a graduate student")
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
            title: "View student's NFT degree",
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

    function popUploadDegreeCertificate() {
        return (
            <div>
                <input
                    type="file"
                    className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Form
                    buttonConfig={{
                        text: "Upload degree certificate",
                        theme: "primary",
                    }}
                    data={[
                        {
                            key: "StudentName",
                            name: "Student name",
                            type: "text",
                            validation: {
                                required: true,
                            },
                            value: "",
                        },
                        {
                            key: "StudentSurname",
                            name: "Surname student",
                            type: "text",
                            validation: {
                                required: true,
                            },
                            value: "",
                        },
                        {
                            key: "StudentDegreeCourse",
                            name: "Student's degree course",
                            type: "text",
                            validation: {
                                required: true,
                            },
                            value: "",
                        },
                        {
                            key: "StudentGrade",
                            name: "Grade",
                            type: "number",
                            validation: {
                                required: true,
                            },
                            value: "",
                        },
                    ]}
                    onSubmit={uploadDegreeCertificateExecution}
                    title="Upload now"
                    isDisabled={isLoading || isFetching}
                />
            </div>
        )
    }

    function popUpAssociateNft() {
        return (
            <Form
                buttonConfig={{
                    text: "Associate NFT to student",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "NFTUrl",
                        name: "Certificate IPFS Url",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                    {
                        key: "StudentAddress",
                        name: "Student public key",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={associateNftExecution}
                title="Create NFT"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    function popUpViewNft() {
        return (
            <Form
                buttonConfig={{
                    text: "View student's certificate",
                    theme: "primary",
                }}
                data={[
                    {
                        key: "StudentAddress",
                        name: "Student public key",
                        type: "text",
                        validation: {
                            required: true,
                        },
                        value: "",
                    },
                ]}
                onSubmit={viewNftExecution}
                title="View NFT"
                isDisabled={isLoading || isFetching}
            />
        )
    }

    return (
        <div>
            <h1 className="py-4 px-4 font-bold text-3xl mb-5 hover:animate-pulse">
                Welcome, {areaSecretariat} secretary!
            </h1>
            <span className="flex flex-row font-medium hover:text-sky-400">
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
                    Modify subjects
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/external-itim2101-lineal-color-itim2101/512/external-homework-back-to-school-itim2101-lineal-color-itim2101.png"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-36 ">
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
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Edit subject's prof
                            </button>
                        }
                        position="right center"
                        contentStyle={{ width: "25%", height: "35%" }}
                    >
                        {popUpModifyTeacher()}
                    </Popup>
                </span>
            </div>
            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Teachers info
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/plasticine/512/teacher.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-40">
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
                </span>
            </div>
            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Students management
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/office/512/student-male.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-24">
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
            <div>
                <span className="flex flex-row font-medium hover:text-sky-400 mt-10">
                    Degree certificate NFT
                    <Avatar
                        theme="image"
                        image="https://img.icons8.com/color-glass/512/nft-artwork.png"
                        isRounded="true"
                    />
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-24">
                                Upload degree certificate
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "70%" }}
                    >
                        {popUploadDegreeCertificate()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                Associate NFT degree to student
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpAssociateNft()}
                    </Popup>
                    <Popup
                        trigger={
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-10">
                                View student's NFT degree
                            </button>
                        }
                        position="top"
                        contentStyle={{ width: "25%", height: "30%" }}
                    >
                        {popUpViewNft()}
                    </Popup>
                </span>
            </div>
        </div>
    )
}

/* 

    const uploadToIpfs = async () => {
        const metadata = {
            name: "NFT #1",
            description: "This is my first NFT",
            image: file,
            properties: [
                {
                    name: "coolness",
                    value: "very cool",
                },
            ],
        }

        const uploadUrl = await st.upload(metadata)
        alert(uploadUrl)
    }



    <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    <button onClick={uploadToIpfs}>Upload</button>
*/

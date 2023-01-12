import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
// import LotteryEntrance from "../components/LotteryEntrance"
import { useMoralis } from "react-moralis"
import UnictHomepage from "../components/UnictHomepage"

// sotto div classname= flex flex-row <LotteryEntrance className="p-8" /> <UnictHomepage className="p-8" />
const supportedChains = ["31337", "5"]

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    // "/favicon.ico"
    // on the first div className={styles.container}
    return (
        <div>
            <Head>
                <title>Unict</title>
                <meta name="description" content="Universify of Catania" />
                <link
                    rel="icon"
                    href="https://images.squarespace-cdn.com/content/v1/60056c48dfad4a3649200fc0/1611077270135-4EXXT2EB9JJS30OW6ERW/unict-logo.png"
                />
            </Head>
            <Header />
            {isWeb3Enabled ? (
                <div>
                    {supportedChains.includes(parseInt(chainId).toString()) ? (
                        <div className="flex flex-row">
                            <UnictHomepage className="p-8" />
                        </div>
                    ) : (
                        <div>{`Please switch to a supported chainId. The supported Chain Ids are: ${supportedChains}`}</div>
                    )}
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    )
}

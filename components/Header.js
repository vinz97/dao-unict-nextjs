import { ConnectButton, Avatar } from "web3uikit"

export default function Header() {
    return (
        <nav className="bg-gradient-to-r from-cyan-500 to-blue-500 p-5 border-b-2 flex flex-row">
            <Avatar
                theme="image"
                image="https://images.squarespace-cdn.com/content/v1/60056c48dfad4a3649200fc0/1611077270135-4EXXT2EB9JJS30OW6ERW/unict-logo.png"
                isRounded="true"
                size="50"
                avatarBackground
                className="mt-2"
            />
            <h1 className="py-4 px-4 font-bold text-3xl font-mono"> University of Catania</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}

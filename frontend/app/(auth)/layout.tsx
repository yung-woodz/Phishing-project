export default function LayoutAuth({ children }: { children : React.ReactNode}) {
    return (
        <div className="flex flex-col justify-center h-full items-center">
            <p>yungwoodz Dashboard</p>

                <h1 className="text-3xl my-2">
                    Welcome to my biggest project!!
                </h1>
                <h2 className="text-2xl mb-3">YungwoodzDashboard</h2>

            {children}
        </div>
    )
}
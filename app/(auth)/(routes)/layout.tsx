const AuthLayout = ({children}:{
    children: React.ReactNode
}) => {
    return ( 
        // rendering the sign-in and sign-up
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
     );
}
 
export default AuthLayout;
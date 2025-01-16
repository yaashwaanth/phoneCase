import MaxWidthWrapper from "@/app/component/MaxWidthWrapper";
import Steps from "@/app/component/Steps";
import { ReactNode } from "react";

export default function layout ({children}:{children:ReactNode}){
    return <MaxWidthWrapper className="flex-1 flex flex-col">
        <Steps/>
        {children}
    </MaxWidthWrapper>
}


import Footer from '@/components/app/Footer';
import Header from '@/components/app/Header';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const AppLayout: React.FC<Props> = async ({ children }: Props) => {
    return (
        <div className="meka-app-layout-cn" id="meka-app-layout">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default AppLayout;
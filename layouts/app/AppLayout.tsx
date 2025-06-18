import Footer from '@/layouts/app/Footer';
import Header from '@/layouts/app/Header';
import React, { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const AppLayout: React.FC<Props> = async ({ children }: Props) => {
    return (
        <>
            <Header />
            <main className="pt-20 mb-4">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default AppLayout;
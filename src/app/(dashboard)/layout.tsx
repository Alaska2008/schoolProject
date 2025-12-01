import Link from "next/link";
import Image from "next/image";
import Menu from "../../components/Menu";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return  <div className='h-screen flex pt-0 mt-0'>
    <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-2">
        <Link href='/' className="flex items-center gap:2 justify-center lg:justify-start">
            <Image src='/logo.png' alt='logo' width={24} height={18}/>
            <span className="hidden lg:block font-bold"> Veritas Int. Sch.</span>
        </Link>
        <Menu />
    </div>
    <div className="w-[86%] md:w-[92%] l:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {children}
    </div>
  </div>


}
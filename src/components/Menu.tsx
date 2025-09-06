
// "use client"
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/teacher.png",
        label: "Teachers",
        href: "/list/teachers",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/student.png",
        label: "Students",
        href: "/list/students",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/parent.png",
        label: "Parents",
        href: "/list/parents",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/subject.png",
        label: "Subjects",
        href: "/list/subjects",
        visible: ["admin"],
      },
      {
        icon: "/class.png",
        label: "Classes",
        href: "/list/classes",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/lesson.png",
        label: "Lessons",
        href: "/list/lessons",
        visible: ["admin", "teacher"],
      },
      {
        icon: "/exam.png",
        label: "Exams",
        href: "/list/exams",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/assignment.png",
        label: "Assignments",
        href: "/list/assignments",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/result.png",
        label: "Results",
        href: "/list/results",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/attendance.png",
        label: "Attendance",
        href: "/list/attendance",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/calendar.png",
        label: "Events",
        href: "/list/events",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/message.png",
        label: "Messages",
        href: "/list/messages",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/announcement.png",
        label: "Announcements",
        href: "/list/announcements",
        visible: ["admin", "teacher", "student", "parent"],
      },
      // {
      //   icon: "/finance.png",
      //   label: "Finance",
      //   dropdown: true,
      //   visible: ["admin"],
      //   children: [
      //   {
      //     icon: "/income.png",
      //     label: "Income",
      //     href: "/finance/income",
      //   },
      //   {
      //     icon: "/expense.png",
      //     label: "Expenses",
      //     href: "/finance/expenses",
      //   },
      //   ],
      // },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
        visible: ["admin", "teacher", "student", "parent"],
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
        visible: ["admin", "teacher", "student", "parent"],
      },
      
    ],
  },
];

//{label}:{label:string}
// const Menu = ({ role = "admin" }) => {
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const toggleDropdown = (label) => {
//     setOpenDropdown(openDropdown === label ? null : label);
//   };

//   return (
//     <div className="mt-1 text-sm">
//       {menuItems.map((section) => (
//         <div className="flex flex-col gap-1" key={section.title}>
//           <span className="hidden lg:block text-gray-600 font-light my-2">
//             {section.title}
//           </span>
//           {section.items.map((item) => {
//             if (!item.visible.includes(role)) return null;
                 
//             if (item.dropdown) {
//               return (
//                 <div key={item.label} className="group relative">
//                   <button
//                     onClick={() => toggleDropdown(item.label)}
//                     className="flex items-center justify-center lg:justify-start text-gray-400 gap-4 py-1 hover:text-gray-900 w-full"
//                   >
//                     <div className="flex items-center gap-4 ">
//                       <Image src={item.icon} alt="" width={20} height={15} />
//                       <span className="hidden lg:block">{item.label}</span>
//                     </div>
//                     <span
//                       className={`transition-transform duration-200 ${
//                         openDropdown === item.label ? "rotate-90" : "rotate-0"
//                       }`}
//                     >
//                       ▶
//                     </span>
//                     {/* Tooltip for dropdown parent */}
//                     <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-0 rounded shadow-lg z-10 whitespace-nowrap">
//                       {item.label}
//                     </span>
//                   </button>
               
//                   {openDropdown === item.label && (
//                     <div className="ml-8 mt-1 flex flex-col gap-1">
//                       {item.children.map((child) => (
//                         <Link
//                           key={child.label}
//                           href={child.href}
//                           className="flex items-center justify-center lg:justify-start text-gray-400 gap-4 py-1 hover:text-gray-900 w-full"
//                         >
//                           <Image src={child.icon} width={20} height={15} alt=""/>
//                           <span className="hidden lg:block">{child.label}</span>

//                           {/* Tooltip for child items */}
//                           <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-0 hidden bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
//                             {child.label}
//                           </span>
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }

//             return (
//               <Link
//                 className="group relative flex items-center justify-center lg:justify-start text-gray-400 gap-4 py-1 hover:text-gray-900"
//                 href={item.href}
//                 key={item.label}
//               >
//                 <Image src={item.icon} alt="" width={20} height={15} />
//                 <span className="hidden lg:block">{item.label}</span>

//                 {/* Tooltip */}
//                 <span className=" absolute left-full top-1/2 transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
//                   {item.label}
//                 </span>
//               </Link>
//               // <Link
//               //   className="flex  items-center justify-center lg:justify-start text-gray-400 gap-4 py-1 hover:text-gray-900"
//               //   href={item.href}
//               //   key={item.label}
//               // >
//               //   <Image src={item.icon} alt="" width={20} height={15} />
//               //   <span className="hidden lg:block">{item.label}</span>
//               // </Link>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Menu;

const Menu = async () =>{
    const user = await currentUser();
    const role = user?.publicMetadata.role as string;
  return(
    <div className="mt-1 text-xs">
        {menuItems.map(i =>(
          <div className=" flex flex-col gap-1" key={i.title}>
            <span className="hidden lg:block text-gray-600 font-light my-2">{i.title}</span>
            {i.items.map((item) => {
              if (item.visible.includes(role)){
                return (
                  <Link className="flex items-center justify-center lg:justify-start text-gray-400 gap-2 py-1 md:px-2 rounded-md hover:bg-lamaSkyLight" href={item.href} key={item.label}>
                    <Image src={item.icon} alt="" width={20} height={15}/>
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                )
              }
            })}
          </div>
        ))}
    </div>
  )
}


export default Menu;
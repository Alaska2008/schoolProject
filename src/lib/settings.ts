export  const ITEM_PER_PAGE = 7;
type RouteAccessMap = {
    [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap ={
    "/admin(.*)": ["admin", "superAdmin"],
    "/student(.*)": ["student", "superAdmin"],
    "/teacher(.*)": ["teacher", "superAdmin"],
    "/parent(.*)": ["parent", "superAdmin"],
    "/list/teachers": ["admin", "teacher", "superAdmin"],
    "/list/students": [ "teacher","admin", "superAdmin"],
    "/list/parents": [ "teacher","admin", "superAdmin"],
    "/list/subjects": ["admin", "superAdmin"],
    "/list/classes": [ "teacher","admin", "superAdmin"],
    "/list/exams": [ "teacher","admin", "parent", "student", "superAdmin"],
    "/list/assignments": [ "teacher","admin", "parent", "student", "superAdmin"],
    "/list/attendances": [ "teacher","admin", "parent", "student", "superAdmin"],
    "/list/events": [ "teacher","admin", "parent", "student", "superAdmin"],
    "/list/announcements": [ "teacher","admin", "parent", "student", "superAdmin"],
};


export  const ITEM_PER_PAGE = 7;
type RouteAccessMap = {
    [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap ={
    "/admin(.*)": ["admin"],
    "/student(.*)": ["student"],
    "/teacher(.*)": ["teacher"],
    "/parent(.*)": ["parent"],
    "/list/teachers": ["admin", "teacher"],
    "/list/students": [ "teacher","admin"],
    "/list/parents": [ "teacher","admin"],
    "/list/subjects": ["admin"],
    "/list/classes": [ "teacher","admin"],
    "/list/exams": [ "teacher","admin", "parent", "student"],
    "/list/assignments": [ "teacher","admin", "parent", "student"],
    "/list/attendances": [ "teacher","admin", "parent", "student"],
    "/list/events": [ "teacher","admin", "parent", "student"],
    "/list/announcements": [ "teacher","admin", "parent", "student"],
}
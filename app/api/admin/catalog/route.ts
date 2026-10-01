import { NextRequest, NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
export async function GET(){if(!(await isAdminSessionValid()))return NextResponse.json({error:"Дастрасӣ манъ аст."},{status:401});const [stores,categories]=await prisma.$transaction([prisma.store.findMany({where:{status:"APPROVED"},select:{id:true,name:true},orderBy:{name:"asc"}}),prisma.category.findMany({where:{isActive:true},select:{id:true,name:true},orderBy:{sortOrder:"asc"}})]);return NextResponse.json({stores,categories});}

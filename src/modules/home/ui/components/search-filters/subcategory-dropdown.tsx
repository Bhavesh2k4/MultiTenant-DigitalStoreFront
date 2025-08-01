import React from 'react'
import Link from 'next/link';
import { Category } from '@/payload-types';
import { CategoriesGetManyOutput } from '@/modules/categories/types';

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean; 
}
const SubCategoryDropdown = ({ category, isOpen }: Props) => {
    if (!isOpen || !category.subcategories || category.subcategories.length === 0) {
        return null;
    }

   const backgrondColor = category.color || "F5F5F5"; // Default background color if not specified
   return (
     <div className='absolute z-100' style={{ top: "100%", left: 0 }}>
        <div className='w-60 h-3'/>
        <div style={{backgroundColor: backgrondColor}} 
        className='w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] -translate-x-[2px] -translate-y-[2px]'>
            <div>
                {category.subcategories?.map((subcategory: Category) => (
                    <Link key={subcategory.slug} href={`/${category.slug}/${subcategory.slug}`} className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium'>
                        {subcategory.name}
                    </Link>
                ))}
            </div>
        </div>


     </div>
   )
}

export default SubCategoryDropdown
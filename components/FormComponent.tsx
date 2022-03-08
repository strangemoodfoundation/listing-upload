export const MetaDataForm = () => {
    return(
        <div className="flex flex-col gap-5">
            <div>
                <label className="mb-1">
                    Name
                </label>
                <input type="text"/>
            </div>
            <div>
                <label className="mb-1" >
                    Tagline
                </label>
                <input placeholder=""  type="text"/>
            </div>
            <div>
                <label className="mb-1">
                    Description
                </label>
                <textarea rows={5}/>
            </div>
            <div>
                <label className="mb-1">
                Categories
                </label>
                <input type="text"/>
            </div>
            <div>
                <label className="mb-1">
                Created At
                </label>
                <input className="border-2 ml-2" type="date"/>
            </div>
            {/*<div className="flex justify-center">
            <div className="mb-3 w-96">
                <label className="fblock text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Upload Image</label>
                <input type="file" id="formFile"/>
            </div>
                </div>*/}
        </div>
    )
}
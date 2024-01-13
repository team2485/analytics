export default function Qualitative ({ visibleName, internalName}) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            Todo: Star Ratings
        </div>
    )
}
export default function Qualitative ({ visibleName, internalName}) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <div>★</div>
            <div>★</div>
            <div>★</div>
            <div>★</div>
        </div>
    )
}
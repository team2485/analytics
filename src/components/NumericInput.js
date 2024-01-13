export default function NumericInput ({ visibleName, internalName }) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <input type="number" id={internalName}></input>
        </div>
    )
}
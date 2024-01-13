export default function CommentBox ({ visibleName, internalName}) {
    return (
        <div>
            <label htmlFor={internalName}>{visibleName}</label>
            <textarea id={internalName}></textarea>
        </div>
    )
}
export default interface Abortable {
    abort(): Promise<unknown>
}
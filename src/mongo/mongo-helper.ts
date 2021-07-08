export class MongoHelper {
    // https://gist.github.com/penguinboy/762197#gistcomment-3448642
    public toDotNotation<T>(
        obj: T,
        path: string | null = null,
        separator = '.'
    ): T {
        return Object.keys(obj).reduce((acc: T, key: string): T => {
            const value = obj[key as keyof T];

            const newPath = Array.isArray(obj)
                ? `${path ? path : ''}[${key}]`
                : [path, key].filter(Boolean).join(separator);

            const isObject = [this.isObject(value)].every(Boolean);

            return isObject
                ? { ...acc, ...this.toDotNotation(value, newPath, separator) }
                : { ...acc, [newPath]: value };
        }, {} as T);
    }

    /**
     * convert each field in object to 'k: 1' for projection
     * @param obj
     * @returns
     */
    public toProjection<T>(obj: T): T {
        Object.keys(obj).forEach(k => {
            const v = obj[k as keyof T];
            if (this.isObject(v)) {
                this.toProjection(v);
                return obj;
            }
            return ((obj as Record<string, unknown>)[k] = 1);
        });
        return obj;
    }

    /**
     * is value 'proper' object
     * @param v
     * @returns
     */
    private isObject(v: unknown) {
        return (
            typeof v == 'object' &&
            !(v instanceof Date) &&
            !Array.isArray(v) &&
            !(v instanceof RegExp)
        );
    }
}

export const mongoHelper = new MongoHelper();

export{};

declare global{
    namespace NodeJS{
        interface ProcessEnv{
            user: string | undefined;
            pwd:string|undefined;
        }
    }
}
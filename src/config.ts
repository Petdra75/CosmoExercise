import dotenv from 'dotenv'

dotenv.config();

export function getEnvVariable(variable_name: string) : string {
    return process.env[variable_name] || ""
}
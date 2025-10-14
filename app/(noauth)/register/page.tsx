import IconFacebook from '@/components/icons/icon-facebook'
import IconGoogle from '@/components/icons/icon-google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AtSign, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Register() {
    return (
        <div className=" w-full gap-5 p-4 ">
            
            <div className="flex overflow-y-auto py-2">
                <Card className="m-auto w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
                    <CardHeader className="space-y-2">
                        <h2 className="text-xl/tight font-semibold text-black">
                            Getting started
                        </h2>
                        <p className="font-medium leading-tight">
                            Create an account to connect with people.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-[30px]">
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="#">
                                <Button
                                    variant={'outline-general'}
                                    size={'large'}
                                    className="w-full"
                                >
                                    <IconGoogle className="size-[18px]!" />
                                    Google
                                </Button>
                            </Link>
                            <Link href="#">
                                <Button
                                    variant={'outline-general'}
                                    size={'large'}
                                    className="w-full"
                                >
                                    <IconFacebook className="size-[18px]! text-[#0866FF]" />
                                    Facebook
                                </Button>
                            </Link>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <span className="h-px w-full bg-[#E2E4E9]"></span>
                            <p className="shrink-0 font-medium leading-tight">
                                or register with email
                            </p>
                            <span className="h-px w-full bg-[#E2E4E9]"></span>
                        </div>
                        <form className="space-y-[30px]">
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Your name
                                </label>
                                <Input
                                    type="text"
                                    variant={'input-form'}
                                    placeholder="Victoria Gillham"
                                    iconRight={<User className="size-[18px]" />}
                                />
                            </div>
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Email address
                                </label>
                                <Input
                                    type="email"
                                    variant={'input-form'}
                                    placeholder="username@domain.com"
                                    iconRight={
                                        <AtSign className="size-[18px]" />
                                    }
                                />
                            </div>

                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Create password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                            </div>
                            <div className="mb-4! relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Confirm password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                            </div>
                            <Link
                                href="/forgot"
                                className="mt-4! block text-right text-xs/4 font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
                            >
                                Forgot password?
                            </Link>
                            <Button
                                type="submit"
                                variant={'black'}
                                size={'large'}
                                className="w-full"
                            >
                                Register
                            </Button>
                            <div className="text-center text-xs/4 font-semibold text-black">
                                Already have an account?
                                <Link
                                    href="/login"
                                    className="pl-1.5 text-sm/tight underline underline-offset-4 hover:text-[#3C3C3D]"
                                >
                                    Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

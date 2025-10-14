import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Password() {
    return (
        <div className=" w-full gap-5 p-4">
            
            <div className="flex overflow-y-auto py-2">
                <Card className="m-auto w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
                    <CardHeader className="space-y-2">
                        <h2 className="text-xl/tight font-semibold text-black">
                            Set new password
                        </h2>
                        <p className="font-medium leading-tight">
                            Must be at least 8 characters
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-[30px]">
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                                <div className="mt-4! grid grid-cols-3 gap-[18px]">
                                    <span className="h-1 rounded-full bg-danger" />
                                    <span className="h-1 rounded-full bg-warning" />
                                    <span className="h-1 rounded-full bg-gray-300" />
                                </div>
                            </div>
                            <div className="relative space-y-3">
                                <label className="block font-semibold leading-none text-black">
                                    Confirm password
                                </label>
                                <Input
                                    type="password"
                                    variant={'input-form'}
                                    placeholder="Abc*********"
                                />
                            </div>

                            <Button
                                type="submit"
                                variant={'black'}
                                size={'large'}
                                className="w-full"
                            >
                                Reset password
                            </Button>
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 pl-1.5 text-sm/tight font-semibold text-black hover:text-[#3C3C3D]"
                            >
                                <ArrowLeft className="size-[18px]" />
                                Back to Login
                            </Link>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

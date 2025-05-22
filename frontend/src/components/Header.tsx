import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import SignOutButton from './SignOutButton'
import SignInButton from './SignInButton'
import SignUpButton from './SignUpButton'
import GuestButton from './GuestButton'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16">
      <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
        MedhaBee
      </Link>
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
          <GuestButton />
        </SignedOut>
      </div>
    </header>
  )
}

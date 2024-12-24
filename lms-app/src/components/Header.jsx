// src/components/Header.js
import { Link } from 'react-router-dom';
import { Button } from "./shadcn/button";

const Header = () => {
    return (
        <header className="border-b">
            <div className="container flex h-16 items-center px-4 mx-auto">
                <div className="mr-4 hidden md:flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            My LMS
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link to="/" className="transition-colors hover:text-foreground/80">
                            Home
                        </Link>
                        <Link to="/courses" className="transition-colors hover:text-foreground/80">
                            Courses
                        </Link>
                        <Link to="/dashboard" className="transition-colors hover:text-foreground/80">
                            Dashboard
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Login
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm">
                                Sign up
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
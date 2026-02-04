interface AuthImageSectionProps {
    alt: string;
}

export default function AuthImageSection({ alt }: AuthImageSectionProps) {
    return (
        <div className="hidden md:block w-full h-full flex items-center bg-[#000842] rounded-xl p-8">
            <img
                src="/images/login.jpg"
                className="w-full h-full object-cover rounded-lg"
                alt={alt}
            />
        </div>
    );
}

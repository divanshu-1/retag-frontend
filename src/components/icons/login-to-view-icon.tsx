'use client';

const LoginToViewIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g className="group">
            {/* Sparkles */}
            <path d="M22.5 73.5L25.5 76.5" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
            <path d="M25.5 73.5L22.5 76.5" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
            <path d="M94.5 40.5L97.5 43.5" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
            <path d="M97.5 40.5L94.5 43.5" stroke="#4FD1C5" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
            
            {/* Back card */}
            <path d="M34.8218 19.5393C34.3311 18.7891 33.4549 18.3333 32.5 18.3333H25C23.067 18.3333 21.5 19.8003 21.5 21.7333V84.2667C21.5 86.1997 23.067 87.7667 25 87.7667H75C76.933 87.7667 78.5 86.1997 78.5 84.2667V44.8333C78.5 43.8291 78.0101 42.899 77.1782 42.2222L34.8218 19.5393Z"
                fill="#E6FFFA" stroke="#81E6D9" strokeWidth="3"
                className="transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-translate-x-1"
            />
            <path d="M60 28.5H65.3333V32.8333H60V28.5Z" fill="#81E6D9" className="transition-all duration-500 ease-out group-hover:fill-teal-500" />
            
            {/* Front card */}
            <g className="transition-transform duration-500 ease-out group-hover:translate-y-2 group-hover:translate-x-1">
                <path d="M96.6718 31.636C96.8392 31.3258 96.747 30.9537 96.4795 30.756L42.4795 0.838531C42.208 0.638062 41.849 0.698379 41.6647 0.970125L21.2965 31.03C21.1122 31.3018 21.1706 31.6631 21.4421 31.8636L75.4421 71.7811C75.7136 71.9815 76.0726 71.9212 76.2569 71.6495L96.6718 31.636Z"
                    fill="white" stroke="#81E6D9" strokeWidth="3"
                />
                
                {/* Plus icon */}
                <path d="M43.3333 51H56.6667" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round"/>
                <path d="M50 44.3333V57.6666" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round"/>

                {/* Lines */}
                <path d="M63.3333 48.5H74" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>
                <path d="M63.3333 56.5H68.6667" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round"/>

                 {/* Sparkles */}
                <path d="M31.5 67.5L34.5 70.5" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
                <path d="M34.5 67.5L31.5 70.5" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-300 group-hover:scale-125 origin-center" />
            </g>
        </g>
    </svg>
);

export { LoginToViewIcon };

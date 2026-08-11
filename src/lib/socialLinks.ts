export const socialLinks: {
	label: string;
	href: string;
	download?: boolean;
	icon: 'mail' | 'college' | 'github' | 'gitlab' | 'linkedin' | 'resume';
}[] = [
	{ label: 'Email', href: 'mailto:kumaranubhav20026@gmail.com', icon: 'mail' },
	{ label: 'College', href: 'mailto:kumar.2023ug1026@iiitranchi.ac.in', icon: 'college' },
	{ label: 'GitHub', href: 'https://github.com/KumarAnubhav64', icon: 'github' },
	{ label: 'GitLab', href: 'https://gitlab.com/kumaranubhav20026', icon: 'gitlab' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/kumar-anubhav-45b1aa29a/', icon: 'linkedin' },
	{ label: 'Resumé', href: '/resume.pdf', download: true, icon: 'resume' }
];

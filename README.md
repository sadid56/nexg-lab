## NexG Lab Blog 🚀

This is a Next.js blog project, designed to share content related to coding, Linux, design, and tech.


### How to run my project 👨🏻‍💻

- Clone my github repo
```
git clone https://github.com/sadid56/nexg-lab.git
```

 - Install dependencies
```
pnpm install
```

- Create on root directory .env file and use databse url
```
DATABASE_URL="your data base url"
```

- Generate prisma
```
pnpm prisma generate
```

- Run project
```
pnpm dev
```

### Project Structure 🏗

Here’s an overview of how the project is organized:

```
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma
│   ├── models
│   │   ├── feedbacks.prisma
│   │   ├── posts.prisma
│   │   ├── reactions.prisma
│   │   └── users.prisma
│   └── schema.prisma
├── prisma.config.ts
├── public
│   └── favicon.ico
├── README.md
├── src
│   ├── app
│   │   ├── (auth)
│   │   ├── (blogs)
│   │   ├── dashboard
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components
│   │   ├── global
│   │   ├── layouts
│   │   └── ui
│   ├── lib
│   │   ├── prisma.ts
│   │   └── utils.ts
│   └── providers
│       └── Providers.tsx
└── tsconfig.json
```

### Features 🛠

- Full-stack blog using Next.js App Directory and TypeScript
- Prisma ORM with PostgreSQL for storing all data
- Tailwind CSS + Shadcn/UI for fast, modern, responsive UI
- Authentication system for track user

### Why I Created NexG Lab? 🌟

NexG Lab was born out of my own coding and Linux journey. As I explored programming, web development, and Linux systems, I faced many challenges that often felt overwhelming:

- Setting up development environments on Linux for the first time
- Debugging tricky code issues in JavaScript, Next.js, and full-stack projects
- Understanding database management with tools like Prisma and PostgreSQL
- Keeping up with modern UI/UX design practices and component libraries
- Finding reliable resources for solving errors, deployment issues, and optimization problems

Each obstacle required a lot of trial and error, research, and patience. I realized that many of these challenges are common for developers starting out, especially for those learning Linux, coding, and modern web development.

So, I decided to create NexG Lab — a platform where I can share my experiences, solutions, and tutorials:

- Step-by-step guides for solving common coding problems
- Linux tips and tricks that I wish I had when I started
- Tech tutorials, design insights, and project showcases
- A place for future developers to learn without repeating the same struggles

My goal is simple: help the next generation of developers overcome the hurdles I faced, so they can focus more on building and creating, instead of getting stuck on avoidable problems.

NexG Lab is more than a blog — it’s a knowledge hub for learning, experimentation, and growth in coding, Linux, and tech.

## Thanks for exploring NexG Lab ❤️

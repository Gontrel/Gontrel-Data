# Gontrel Admin Dashboard

This is the admin dashboard for Gontrel, a platform for managing restaurant data. It is built with Next.js, TypeScript, and Tailwind CSS, and it uses tRPC for type-safe API communication.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Gontrel/Gontrel-Data.git
    cd Gontrel-Data
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Before you can run the application, you need to set up your environment variables.

1.  Create a new file named `.env.local` in the root of the project.
2.  Add the following variables to the file, replacing the placeholder values with your actual API credentials:

    ```
    API_BASE_URL=add_server_based_url
    API_KEY=add_secret_key
    ```

### Running the Development Server

Once you've installed the dependencies and set up your environment variables, you can start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application. The page will auto-update as you edit the files.

## Key Technologies

- **Next.js:** A React framework for building server-side rendered and static web applications.
- **TypeScript:** A statically typed superset of JavaScript that adds type safety.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **tRPC:** A library for building end-to-end type-safe APIs.
- **TanStack Table:** A headless UI library for building powerful data tables.
- **Ant Design Charts:** A library for creating beautiful and interactive charts.

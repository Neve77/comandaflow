const { spawn } = require('child_process');

function runProcess(name, command, args, cwd) {
  const proc = spawn(command, args, {
    cwd,
    shell: true
  });

  proc.stdout.on('data', (data) => {
    console.log(`[${name}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    console.error(`[${name} ERROR] ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`[${name}] finalizado com código ${code}`);
  });
}

// Backend
runProcess(
  "BACKEND",
  "npm",
  ["run", "dev"],
  "E:\\comandaflow\\backend"
);

// Frontend
runProcess(
  "FRONTEND",
  "npm",
  ["run", "dev"],
  "E:\\comandaflow\\frontend"
);

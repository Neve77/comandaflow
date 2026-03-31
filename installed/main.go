package main

import (
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"golang.org/x/sys/windows/svc"
	"golang.org/x/sys/windows/svc/mgr"
)

const serviceName = "ComandaFlow"

var base = "E:\\comandaflow"

type service struct{}

func (s service) Execute(args []string, r <-chan svc.ChangeRequest, changes chan<- svc.Status) (bool, uint32) {
	changes <- svc.Status{State: svc.StartPending}
	startProcesses()
	changes <- svc.Status{State: svc.Running, Accepts: svc.AcceptStop | svc.AcceptShutdown}
	for c := range r {
		switch c.Cmd {
		case svc.Stop, svc.Shutdown:
			changes <- svc.Status{State: svc.StopPending}
			return false, 0
		}
	}
	return false, 0
}

func startProcesses() {
	os.MkdirAll(filepath.Join(base, "logs"), os.ModePerm)
	backend := exec.Command("npm", "run", "dev")
	backend.Dir = filepath.Join(base, "backend")
	backend.Start()
	time.Sleep(5 * time.Second)
	frontend := exec.Command("npm", "run", "dev")
	frontend.Dir = filepath.Join(base, "frontend")
	frontend.Start()
	time.Sleep(5 * time.Second)
	exec.Command("cmd", "/c", "start http://localhost:3000").Start()
}

func installService(exePath string) error {
	m, err := mgr.Connect()
	if err != nil {
		return err
	}
	defer m.Disconnect()
	s, err := m.CreateService(serviceName, exePath, mgr.Config{
		DisplayName: "ComandaFlow",
		Description: "Sistema de comanda digital",
		StartType:   mgr.StartAutomatic,
	})
	if err != nil {
		return err
	}
	defer s.Close()
	return s.Start()
}

func main() {
	isService, err := svc.IsWindowsService()
	if err != nil {
		panic(err)
	}
	if isService {
		svc.Run(serviceName, new(service))
		return
	}
	exePath, err := os.Executable()
	if err != nil {
		panic(err)
	}
	installService(exePath)
}

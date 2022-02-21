# Microservicios
## Charla sobre microservicios

## Installation

Pre requisitos
```sh
Docker (Recomendación instalar docker desktop y activar kubertenes)
Kubernetes
Skaffold
Instalar Ngnix Controller: kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.1/deploy/static/provider/cloud/deploy.yaml
```

Instalación

```sh
Agregar en el host de su maquina: nodeco.local 127.0.0.1
git clone https://github.com/dsegovia-wolox/nerdearla
cd nerdearla
skaffold dev
```
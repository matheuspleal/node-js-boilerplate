.PHONY: help build up start stop dev migrate down prune

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE := \033[1;34m
GREEN := \033[1;32m
RED := \033[1;31m
YELLOW := \033[1;33m
NC := \033[0m # No Color

# ===========================================================================
# Help
# ===========================================================================

help: ## 📖 Show this help message
	@echo ""
	@echo "$(BLUE)============================  🪄  WIZARD  🪄  =============================$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(RED)*************************** 🚨 DANGER ZONE 🚨 ****************************$(NC)"
	@echo ""
	@echo "  $(RED)down$(NC)            🧨 Down containers (Removes all containers)"
	@echo "  $(RED)fresh$(NC)          🔄 Fresh start (down + build + up + migrate)"
	@echo "  $(RED)prune$(NC)           💣 Docker deep clean (Irreversible!)"
	@echo ""
	@echo "$(RED)**************************************************************************$(NC)"
	@echo ""
	@echo "$(BLUE)================== 🐙 Developed by @matheuspleal 🐙 ======================$(NC)"
	@echo ""
# ===========================================================================
# Main Commands
# ===========================================================================

build: ## 🧱 Build images
	@echo "$(BLUE)========================== 🧱 BUILD-IMAGES 🧱 ===========================$(NC)"
	docker-compose build
	@echo "$(GREEN)🧱 Build executed successfully!$(NC)"

up: ## 🐳 Up containers (Detached mode)
	@echo "$(BLUE)========================== 🐳 UP-CONTAINERS 🐳 ==========================$(NC)"
	docker-compose up -d
	@echo "$(GREEN)🐳 Containers are up!$(NC)"

start: ## 🚀 Start containers
	@echo "$(BLUE)======================== 🚀 START CONTAINERS 🚀 =========================$(NC)"
	docker-compose start
	@echo "$(GREEN)🚀 Containers started!$(NC)"

stop: ## 🛑 Stop containers
	@echo "$(BLUE)======================== 🛑 STOP CONTAINERS 🛑 ==========================$(NC)"
	docker-compose stop
	@echo "$(GREEN)🛑 Containers stopped!$(NC)"

dev: ## 🐙 Start development mode
	@echo "$(BLUE)======================== 🐙 START DEV 🐙 ================================$(NC)"
	docker-compose up database -d
	npm run start:dev

migrate: ## 🏁 Run Prisma migrations
	@echo "$(BLUE)========================= 🏁 RUN-MIGRATIONS 🏁 ==========================$(NC)"
	npx prisma migrate dev
	@echo "$(GREEN)🏁 Migrations executed successfully!$(NC)"

# ===========================================================================
# Danger Zone Commands
# ===========================================================================

down:
	@echo "$(RED)========================== 🧨 DOWN-CONTAINERS 🧨 =========================$(NC)"
	docker-compose down
	@echo "$(YELLOW)🧨 Containers removed!$(NC)"

prune:
	@echo "$(RED)======================= 🧼 DOCKER DEEP CLEAN 🧼 =========================$(NC)"
	@echo "$(RED)🚨 Attention 🚨$(NC)"
	@echo ""
	@echo "This action is irreversible! Are you sure you want to deep clean Docker?"
	@read -p "Type 'yes' to confirm: " confirm && [ "$$confirm" = "yes" ] || (echo "$(GREEN)Operation cancelled$(NC)" && exit 1)
	-docker rmi -f $$(docker images -aq)
	docker system prune --all --volumes --force
	-docker rm -vf $$(docker ps -aq)
	@echo "$(GREEN)💣 Docker deep clean executed!$(NC)"

fresh: down build up migrate
	@echo "$(GREEN)🔄 Fresh start completed!$(NC)"

# ===========================================================================
# Compound Commands
# ===========================================================================

restart: stop start ## 🔃 Restart containers (stop + start)
	@echo "$(GREEN)🔃 Containers restarted!$(NC)"


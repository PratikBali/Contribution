#!/bin/bash

# Monitor Angular development commands
monitor_ng_commands() {
    local command="$*"
    local output
    
    echo "Executing: $command"
    output=$(eval "$command" 2>&1)
    local exit_code=$?
    
    echo "$output"
    
    # Auto-analyze Angular-specific issues
    if [[ $exit_code -ne 0 ]] || echo "$output" | grep -E "(ERROR|WARN|Failed to compile)"; then
        analyze_angular_output "$command" "$output"
    fi
}

analyze_angular_output() {
    local command="$1"
    local output="$2"
    
    # Send to your preferred LLM service
    curl -X POST "your-llm-endpoint" \
        -H "Content-Type: application/json" \
        -d "{
            "context": "Angular development",
            "command": "$command",
            "output": "$output",
            "project_info": {
                "framework": "Angular 9",
                "features": ["Firebase", "Material Design", "Bootstrap"]
            }
        }"
}

# Alias common Angular commands
alias ng-serve='monitor_ng_commands ng serve'
alias ng-build='monitor_ng_commands ng build'
alias ng-test='monitor_ng_commands ng test'
alias npm-install='monitor_ng_commands npm install'
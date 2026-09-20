from app.agent.skill_loader import load_all_skills


skills = load_all_skills()

print("SO SKILL:", len(skills))

for name, content in skills.items():
    print("\n==============================")
    print("SKILL:", name)
    print("LOADED:", bool(content))
    print("SIZE:", len(content), "characters")
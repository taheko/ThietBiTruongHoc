from pathlib import Path


SKILLS_DIR = Path(__file__).resolve().parent.parent / "skills"


SKILL_PATHS = {
    "inventory_report": SKILLS_DIR / "inventory_report" / "skill.md",
    "condition_summary": SKILLS_DIR / "condition_summary" / "skill.md",
    "replacement_recommendation": SKILLS_DIR / "replacement_recommendation" / "skill.md",
    "testing": SKILLS_DIR / "testing" / "skill.md",
}


def load_skill(skill_name: str) -> str:
    path = SKILL_PATHS.get(skill_name)

    if path is None:
        raise ValueError(f"Unknown skill: {skill_name}")

    if not path.exists():
        raise FileNotFoundError(f"Skill file not found: {path}")

    return path.read_text(encoding="utf-8")


def load_all_skills() -> dict[str, str]:
    skills = {}

    for name in SKILL_PATHS:
        skills[name] = load_skill(name)

    return skills


def list_skills() -> list[str]:
    return list(SKILL_PATHS.keys())
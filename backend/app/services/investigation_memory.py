class InvestigationMemory:

    def __init__(self):
        self.memory = {}


    def add_message(
        self,
        case_id,
        role,
        message
    ):

        if case_id not in self.memory:
            self.memory[case_id] = []


        self.memory[case_id].append(
            {
                "role": role,
                "message": message
            }
        )


    def get_history(self, case_id):

        return self.memory.get(
            case_id,
            []
        )
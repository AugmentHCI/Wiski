<?php

function wiski_rules_event_info() {
  return array(
    'meerkeuzevraag_fout_beantwoord' => array(
      'label' => t('Een meerkeuzevraag werd verkeerd beantwoord'),
      'group' => t('Quiz question'),
      'module' => 'wiski',
      'variables' => array(
        'quiz_result_answer' => array('type' => 'quiz_result_answer', 'label' => t('Quiz result answer')),
      ),
    ),
    'hulppagina_bekeken_tijdens_quiz' => array(
      'label' => t('De gebruiker bekeek de hulppagina van een meerkeuzevraag tijdens een quiz'),
      'group' => t('Quiz question'),
      'module' => 'wiski',
      'variables' => array(
        'meerkeuzevraag' => array('type' => 'node', 'label' => t('Meerkeuzevraag')),
        'quiz'=> array('type' => 'node', 'label' => t('Meerkeuzevraag')),
      ),
    ),
  );
}

function wiski_rules_action_info() {
  return array(
    'stop_quiz' => array(
      'label' => t('Stop quiz'),
      'group' => t('Quiz'),
      'module' => 'wiski',
      'parameter' => array(
        'quiz' => array('type' => 'node', 'label' => t('Quiz')),
      ),
      'base' => 'wiski_action_quiz_gestopt',
    ),
    'booleanveld_instellen' => array(
      'label' => t('Booleanveld instellen'),
      'group' => t('User'),
      'module' => 'wiski',
      'parameter' => array(
        'user' => array('type' => 'user', 'label' => t('User')),
        'field' => array('type' => 'text', 'label' => t('Field')),
        'boolean' => array('type' => 'boolean', 'label' => t('Boolean')),
      ),
      'base' => 'wiski_action_boolean_instellen',
    ),
    'gamification_mechanics_instellen' => array(
      'label' => t('Gamification mechanics instellen'),
      'group' => t('User'),
      'module' => 'wiski',
      'parameter' => array(
        'user' => array('type' => 'user', 'label' => t('User')),
        'boolean' => array('type' => 'boolean', 'label' => t('Boolean')),
      ),
      'base' => 'wiski_action_gamification_mechanics_instellen',
    ),
  );
}

/**
* Beëindig een quiz.
*
* @see quiz_question_answering_form_finalize()
*/
function wiski_action_quiz_gestopt($quiz) {
  $quiz_result = quiz_result_load($_SESSION['quiz'][$quiz->nid]['result_id']);
  // No more questions. Score quiz.
  $score = quiz_end_scoring($_SESSION['quiz'][$quiz->nid]['result_id']);
  // Call hook_quiz_finished().
  module_invoke_all('quiz_finished', $quiz, $score, $_SESSION['quiz'][$quiz->nid]);
  // Remove all information about this quiz from the session.
  $_SESSION['quiz']['temp']['result_id'] = $quiz_result->result_id;
  unset($_SESSION['quiz'][$quiz->nid]);
}

/**
* Stel de waarde in van een booleanveld voor een opgegeven gebruiker.
*/
function wiski_action_boolean_instellen($user, $field, $boolean) {
  $edit[$field][LANGUAGE_NONE][0]['value'] = $boolean;
  user_save($user, $edit);
}

/**
* Gamification mechanics instellen.
*/
function wiski_action_gamification_mechanics_instellen($user, $boolean) {
  if ($boolean) {
    wiski_gepersonaliseerde_gamification_mechanics_instellen($user);
  } else {
    wiski_willekeurige_gamification_mechanics_instellen($user);
  }
}

new Vue({
	el: "#app",
	data: {
		status :'init',
		title: "ようこそ",
		message: "以下のボタンをクリック",
		quizzes: [],
		correct: null,
		current: null,
		level: '',
		genre: '',
		choices: [],  
	},
	methods: {
		getQuiz: function(){
			// 取得中の表示に切り替え
			this.status = "load"
			this.title = "取得中"
			this.message = "少々お待ちください"
			
			// fetchを用いたJSONデータの取得
			// 参考：https://blog.capilano-fw.com/?p=6646
			fetch('https://opentdb.com/api.php?amount=10')
				.then((response) => {
					return response.json();
				})
				.then(data => { // JSONデータの取得
					// console.log(data);

					// 配列にクイズデータを投入
					this.quizzes = [];
					for(let i=0; i<data.results.length; i++){

						// クイズの基礎情報（設問、ジャンル、難易度）
						let quizzes = [];
						quizzes.question = data.results[i].question
						quizzes.genre = data.results[i].category
						quizzes.level = data.results[i].difficulty

						// 選択肢の設定
						let choices = [];
						for(let j=0; j<data.results[i].incorrect_answers.length; j++){
							choices.push({text : data.results[i].incorrect_answers[j], correct : false});
						}
						choices.push({text : data.results[i].correct_answer, correct : true});

						// 選択肢をランダムに並び替えて設問配列に追加
						quizzes.choices = this.shuffle(choices);
						this.quizzes.push(quizzes);
					}
					// ステータスを変更しクイズを表示
					this.status = 'question'
					this.current = 0
					this.correct = 0

					// クイズを表示
					this.showQuiz();
				})
				.catch(error => { // エラー処理
					// console.log(error);
					this.title = 'エラー'
					this.message = 'クイズの取得に失敗しました。'
				});
		},
		showQuiz: function(){
			this.title = `問題${this.current+1}`
			this.level =  this.quizzes[this.current].level
			this.genre =  this.quizzes[this.current].genre
			this.message =  this.quizzes[this.current].question
			this.choices = this.quizzes[this.current].choices
		},
		selectChoice: function(val){
			if(this.quizzes[this.current].choices[val].correct) this.correct ++;
			if(this.current < (this.quizzes.length - 1)){
				this.current ++;
				this.showQuiz()
			}
			else{
				this.showResults()
			}
		},
		showResults: function(){
			this.status = 'result'
			this.title = `あなたの正答数は${this.correct}です！！`
			this.message = '再度チャレンジしたい場合は以下をクリック！！'
		},
		setInit: function(){
			this.status ='init'
			this.title= "ようこそ"
			this.message= "以下のボタンをクリック"
		},
		shuffle: function(array) {
			for (let i = array.length - 1; i >= 0; i--) {
				const r = Math.floor(Math.random() * (i + 1));
				[array[i], array[r]] = [array[r], array[i]];
			}
			return array;
		}
	}
  })